
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PayrollManagement = () => {
  const { data: payrollRecords, isLoading } = useQuery({
    queryKey: ['payroll-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select(`
          *,
          employee:profiles!employee_id(first_name, last_name, employee_id)
        `)
        .order('pay_period_end', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const totalPayroll = payrollRecords?.reduce((sum, record) => sum + (record.net_pay || 0), 0) || 0;
  const paidRecords = payrollRecords?.filter(record => record.is_paid).length || 0;
  const pendingRecords = payrollRecords?.filter(record => !record.is_paid).length || 0;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading payroll data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-gray-600">Manage employee salaries and payroll processing</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          Process Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              SSP {totalPayroll.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Records</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {paidRecords}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingRecords}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              SSP {payrollRecords?.length ? Math.round(totalPayroll / payrollRecords.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per employee
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Pay Period</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {record.employee ? 
                          `${record.employee.first_name} ${record.employee.last_name}` : 
                          'Unknown Employee'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.employee?.employee_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {record.pay_period_start} to {record.pay_period_end}
                    </div>
                  </TableCell>
                  <TableCell>SSP {record.basic_salary?.toLocaleString()}</TableCell>
                  <TableCell>SSP {record.allowances?.toLocaleString() || '0'}</TableCell>
                  <TableCell>SSP {record.deductions?.toLocaleString() || '0'}</TableCell>
                  <TableCell className="font-medium">
                    SSP {record.net_pay?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={record.is_paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {record.is_paid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {!record.is_paid && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Pay
                        </Button>
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

export default PayrollManagement;

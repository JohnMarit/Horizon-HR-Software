import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, DollarSign, BookOpen, Bell, Building, UserPlus } from 'lucide-react';
import EmployeeManagement from './EmployeeManagement';
import LeaveManagement from './LeaveManagement';
import PayrollManagement from './PayrollManagement';
import RecruitmentManagement from './RecruitmentManagement';
import PerformanceManagement from './PerformanceManagement';
import TrainingManagement from './TrainingManagement';
import AnnouncementManagement from './AnnouncementManagement';
import DepartmentManagement from './DepartmentManagement';

const HRPlanning = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { title: 'Total Employees', value: '1,247', icon: Users, change: '+12' },
    { title: 'Active Departments', value: '15', icon: Building, change: '+2' },
    { title: 'Pending Leave Requests', value: '23', icon: Calendar, change: '-5' },
    { title: 'Monthly Payroll', value: 'SSP 2.4M', icon: DollarSign, change: '+8%' },
    { title: 'Open Positions', value: '8', icon: UserPlus, change: '+3' },
    { title: 'Training Programs', value: '12', icon: BookOpen, change: '+1' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            South Sudan National Bank - HRMS
          </h1>
          <p className="text-gray-600">
            Comprehensive Human Resource Management System
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="relative">
            <TabsList className="inline-flex h-auto items-center justify-start gap-2 rounded-md bg-white p-2 shadow-sm w-full overflow-x-auto scrollbar-hide">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Employees</span>
              </TabsTrigger>
              <TabsTrigger value="departments" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <Building className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Departments</span>
              </TabsTrigger>
              <TabsTrigger value="recruitment" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <UserPlus className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Recruitment</span>
              </TabsTrigger>
              <TabsTrigger value="leave" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Leave</span>
              </TabsTrigger>
              <TabsTrigger value="payroll" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Payroll</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex items-center gap-2 min-w-fit px-3 py-3 text-sm whitespace-nowrap">
                <Bell className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Announcements</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Mobile: Add swipe indicator */}
            <div className="flex sm:hidden justify-center mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>Swipe</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-green-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">New employee onboarded</p>
                      <p className="text-xs text-gray-500">John Doe joined IT Department</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Leave request approved</p>
                      <p className="text-xs text-gray-500">Mary Smith - Annual Leave</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Training completed</p>
                      <p className="text-xs text-gray-500">Banking Regulations Course</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('employees')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add New Employee
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('recruitment')}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Post Job Opening
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('leave')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Review Leave Requests
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('payroll')}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payroll
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="recruitment">
            <RecruitmentManagement />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveManagement />
          </TabsContent>

          <TabsContent value="payroll">
            <PayrollManagement />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceManagement />
          </TabsContent>

          <TabsContent value="training">
            <TrainingManagement />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HRPlanning;

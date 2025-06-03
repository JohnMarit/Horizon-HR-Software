import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertTriangle,
  Filter,
  Search,
  Download,
  Eye,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Building
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LeaveEvent {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
  color: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar?: string;
}

interface Department {
  id: string;
  name: string;
  headcount: number;
  minCoverage: number;
}

const LeaveCalendar: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'team'>('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [showConflicts, setShowConflicts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Mock data
  const departments: Department[] = [
    { id: 'personal-banking', name: 'Personal Banking', headcount: 85, minCoverage: 70 },
    { id: 'corporate-banking', name: 'Corporate Banking', headcount: 42, minCoverage: 35 },
    { id: 'trade-finance', name: 'Trade Finance', headcount: 18, minCoverage: 15 },
    { id: 'finance', name: 'Finance & Accounting', headcount: 25, minCoverage: 20 },
    { id: 'operations', name: 'Operations', headcount: 35, minCoverage: 28 },
    { id: 'hr', name: 'Human Resources', headcount: 12, minCoverage: 8 }
  ];

  const employees: Employee[] = [
    { id: 'HB001', name: 'Sarah Akol', department: 'Human Resources', position: 'HR Manager' },
    { id: 'HB002', name: 'James Wani', department: 'Human Resources', position: 'HR Assistant' },
    { id: 'HB003', name: 'Mary Deng', department: 'Corporate Banking', position: 'VP Corporate Banking' },
    { id: 'HB004', name: 'Peter Garang', department: 'Finance & Accounting', position: 'Senior Accountant' },
    { id: 'HB005', name: 'Grace Ajak', department: 'Personal Banking', position: 'Customer Relationship Manager' },
    { id: 'HB006', name: 'Michael Jok', department: 'Trade Finance', position: 'Trade Finance Officer' },
    { id: 'HB007', name: 'Rebecca Akuoc', department: 'Risk Management', position: 'Risk Analyst' },
    { id: 'HB008', name: 'David Majok', department: 'Information Technology', position: 'IT Support Specialist' },
    { id: 'HB009', name: 'Anna Nyong', department: 'Corporate Banking', position: 'Senior Credit Analyst' },
    { id: 'HB010', name: 'John Kuol', department: 'Personal Banking', position: 'Personal Banking Officer' }
  ];

  const leaveEvents: LeaveEvent[] = [
    {
      id: 1,
      employeeId: 'HB005',
      employeeName: 'Grace Ajak',
      department: 'Personal Banking',
      leaveType: 'Annual Leave',
      startDate: '2024-12-23',
      endDate: '2024-12-27',
      days: 5,
      status: 'Approved',
      reason: 'Christmas holiday',
      color: '#3B82F6'
    },
    {
      id: 2,
      employeeId: 'HB006',
      employeeName: 'Michael Jok',
      department: 'Trade Finance',
      leaveType: 'Annual Leave',
      startDate: '2024-12-30',
      endDate: '2025-01-03',
      days: 5,
      status: 'Approved',
      reason: 'New Year break',
      color: '#10B981'
    },
    {
      id: 3,
      employeeId: 'HB007',
      employeeName: 'Rebecca Akuoc',
      department: 'Risk Management',
      leaveType: 'Sick Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      days: 3,
      status: 'Approved',
      reason: 'Medical appointment',
      color: '#F59E0B'
    },
    {
      id: 4,
      employeeId: 'HB010',
      employeeName: 'John Kuol',
      department: 'Personal Banking',
      leaveType: 'Annual Leave',
      startDate: '2024-12-26',
      endDate: '2024-12-31',
      days: 6,
      status: 'Pending',
      reason: 'Year-end vacation',
      color: '#8B5CF6'
    },
    {
      id: 5,
      employeeId: 'HB009',
      employeeName: 'Anna Nyong',
      department: 'Corporate Banking',
      leaveType: 'Study Leave',
      startDate: '2025-01-15',
      endDate: '2025-01-19',
      days: 5,
      status: 'Pending',
      reason: 'Banking certification course',
      color: '#EF4444'
    }
  ];

  const leaveTypeColors = {
    'Annual Leave': '#3B82F6',
    'Sick Leave': '#F59E0B',
    'Maternity Leave': '#EC4899',
    'Paternity Leave': '#8B5CF6',
    'Study Leave': '#EF4444',
    'Emergency Leave': '#DC2626',
    'Unpaid Leave': '#6B7280'
  };

  // Calendar utilities
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isSameDate = (date1: string, date2: string) => {
    return date1 === date2;
  };

  const isDateInRange = (date: string, startDate: string, endDate: string) => {
    return date >= startDate && date <= endDate;
  };

  // Filter leave events
  const filteredLeaveEvents = useMemo(() => {
    return leaveEvents.filter(event => {
      const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
      const matchesEmployee = selectedEmployee === 'all' || event.employeeId === selectedEmployee;
      const matchesSearch = searchQuery === '' || 
        event.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.leaveType.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDepartment && matchesEmployee && matchesSearch;
    });
  }, [selectedDepartment, selectedEmployee, searchQuery]);

  // Get leave events for a specific date
  const getLeaveEventsForDate = (date: string) => {
    return filteredLeaveEvents.filter(event => 
      isDateInRange(date, event.startDate, event.endDate)
    );
  };

  // Check for coverage conflicts
  const getCoverageStatus = (date: string, department: string) => {
    const dept = departments.find(d => d.name === department);
    if (!dept) return { status: 'ok', coverage: 100 };

    const leaveCount = filteredLeaveEvents.filter(event => 
      event.department === department && 
      event.status === 'Approved' &&
      isDateInRange(date, event.startDate, event.endDate)
    ).length;

    const currentCoverage = ((dept.headcount - leaveCount) / dept.headcount) * 100;
    const requiredCoverage = (dept.minCoverage / dept.headcount) * 100;

    if (currentCoverage < requiredCoverage) {
      return { status: 'critical', coverage: currentCoverage };
    } else if (currentCoverage < requiredCoverage + 10) {
      return { status: 'warning', coverage: currentCoverage };
    }
    
    return { status: 'ok', coverage: currentCoverage };
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      const leaveEventsForDay = getLeaveEventsForDate(date);
      const isToday = isSameDate(date, formatDate(new Date()));
      const isWeekend = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() % 6 === 0;

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          } ${isWeekend ? 'bg-gray-100' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            setShowLeaveDialog(true);
          }}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {showConflicts && selectedDepartment !== 'all' && (
              <div className="flex items-center gap-1">
                {(() => {
                  const status = getCoverageStatus(date, selectedDepartment);
                  if (status.status === 'critical') {
                    return <AlertTriangle className="h-3 w-3 text-red-500" />;
                  } else if (status.status === 'warning') {
                    return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
          <div className="space-y-1">
            {leaveEventsForDay.slice(0, 2).map((event) => (
              <TooltipProvider key={event.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="text-xs p-1 rounded text-white truncate"
                      style={{ backgroundColor: event.color }}
                    >
                      {event.employeeName.split(' ')[0]}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{event.employeeName}</p>
                      <p>{event.leaveType}</p>
                      <p>{event.startDate} - {event.endDate}</p>
                      <p>Status: {event.status}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {leaveEventsForDay.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{leaveEventsForDay.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const filteredEmployees = employees.filter(emp => 
    selectedDepartment === 'all' || emp.department === selectedDepartment
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Calendar</h1>
          <p className="text-gray-600">Visual planning and team coverage management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={goToToday}>
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[200px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-48"
            />
          </div>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {filteredEmployees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConflicts(!showConflicts)}
            className={showConflicts ? 'bg-yellow-50 border-yellow-200' : ''}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Conflicts
          </Button>
        </div>
      </div>

      {/* Coverage Alerts */}
      {showConflicts && selectedDepartment !== 'all' && (
        <div className="space-y-2">
          {(() => {
            const today = formatDate(new Date());
            const alerts = [];
            
            // Check next 30 days for coverage issues
            for (let i = 0; i < 30; i++) {
              const checkDate = new Date();
              checkDate.setDate(checkDate.getDate() + i);
              const dateStr = formatDate(checkDate);
              const status = getCoverageStatus(dateStr, selectedDepartment);
              
              if (status.status !== 'ok') {
                alerts.push({
                  date: dateStr,
                  status: status.status,
                  coverage: status.coverage,
                  department: selectedDepartment
                });
              }
            }

            return alerts.slice(0, 3).map((alert, index) => (
              <Alert key={index} className={alert.status === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
                <AlertTriangle className={`h-4 w-4 ${alert.status === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
                <AlertDescription>
                  <strong>{alert.status === 'critical' ? 'Critical' : 'Warning'}:</strong> {alert.department} department on {alert.date} 
                  has {alert.coverage.toFixed(0)}% coverage (below recommended levels)
                </AlertDescription>
              </Alert>
            ));
          })()}
        </div>
      )}

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Detection</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-px mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="h-10 flex items-center justify-center bg-gray-100 font-medium text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px">
                {renderCalendarDays()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline View */}
        <TabsContent value="timeline">
          <div className="space-y-4">
            {filteredEmployees.map((employee) => {
              const employeeLeaves = filteredLeaveEvents.filter(leave => leave.employeeId === employee.id);
              return (
                <Card key={employee.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {employeeLeaves.length} leave{employeeLeaves.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {employeeLeaves.length > 0 ? (
                        employeeLeaves.map((leave) => (
                          <div key={leave.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: leave.color }}
                            ></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{leave.leaveType}</span>
                                <Badge
                                  className={
                                    leave.status === 'Approved' 
                                      ? 'bg-green-100 text-green-800'
                                      : leave.status === 'Pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }
                                >
                                  {leave.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {leave.startDate} - {leave.endDate} ({leave.days} days)
                              </p>
                              {leave.reason && (
                                <p className="text-sm text-gray-500">{leave.reason}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No upcoming leave scheduled</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Coverage Analysis */}
        <TabsContent value="coverage">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const deptLeaves = filteredLeaveEvents.filter(leave => 
                leave.department === dept.name && leave.status === 'Approved'
              );
              const currentCoverage = ((dept.headcount - deptLeaves.length) / dept.headcount) * 100;
              const requiredCoverage = (dept.minCoverage / dept.headcount) * 100;

              return (
                <Card key={dept.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {dept.name}
                    </CardTitle>
                    <CardDescription>
                      {dept.headcount} total staff • {dept.minCoverage} minimum required
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Coverage</span>
                          <span className={
                            currentCoverage >= requiredCoverage ? 'text-green-600' : 'text-red-600'
                          }>
                            {currentCoverage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              currentCoverage >= requiredCoverage ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${currentCoverage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available Staff</span>
                          <span>{dept.headcount - deptLeaves.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>On Leave</span>
                          <span>{deptLeaves.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Required Minimum</span>
                          <span>{dept.minCoverage}</span>
                        </div>
                      </div>

                      {currentCoverage < requiredCoverage && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            Below minimum coverage requirements
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Conflict Detection */}
        <TabsContent value="conflicts">
          <div className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This analysis identifies potential conflicts and coverage issues across departments.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {(() => {
                const conflicts = [];
                const today = new Date();
                
                // Check for overlapping leaves in same department
                for (let i = 0; i < filteredLeaveEvents.length; i++) {
                  for (let j = i + 1; j < filteredLeaveEvents.length; j++) {
                    const leave1 = filteredLeaveEvents[i];
                    const leave2 = filteredLeaveEvents[j];
                    
                    if (leave1.department === leave2.department &&
                        leave1.status === 'Approved' && leave2.status === 'Approved') {
                      
                      // Check for date overlap
                      const overlap = !(leave1.endDate < leave2.startDate || leave2.endDate < leave1.startDate);
                      
                      if (overlap) {
                        const startOverlap = new Date(Math.max(new Date(leave1.startDate).getTime(), new Date(leave2.startDate).getTime()));
                        const endOverlap = new Date(Math.min(new Date(leave1.endDate).getTime(), new Date(leave2.endDate).getTime()));
                        
                        conflicts.push({
                          type: 'overlap',
                          department: leave1.department,
                          employees: [leave1.employeeName, leave2.employeeName],
                          dates: `${startOverlap.toISOString().split('T')[0]} to ${endOverlap.toISOString().split('T')[0]}`,
                          severity: 'high'
                        });
                      }
                    }
                  }
                }

                // Check for coverage issues
                departments.forEach(dept => {
                  const deptLeaves = filteredLeaveEvents.filter(leave => 
                    leave.department === dept.name && 
                    leave.status === 'Approved' &&
                    new Date(leave.startDate) >= today
                  );
                  
                  if (deptLeaves.length > (dept.headcount - dept.minCoverage)) {
                    conflicts.push({
                      type: 'coverage',
                      department: dept.name,
                      employees: deptLeaves.map(l => l.employeeName),
                      dates: 'Multiple dates',
                      severity: 'medium'
                    });
                  }
                });

                return conflicts.length > 0 ? conflicts.map((conflict, index) => (
                  <Card key={index} className="border-l-4 border-l-orange-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`h-4 w-4 ${
                              conflict.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                            }`} />
                            <span className="font-medium">
                              {conflict.type === 'overlap' ? 'Leave Overlap Detected' : 'Coverage Risk'}
                            </span>
                            <Badge variant="outline" className={
                              conflict.severity === 'high' ? 'border-red-200 text-red-700' : 'border-yellow-200 text-yellow-700'
                            }>
                              {conflict.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Department:</strong> {conflict.department}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Affected Employees:</strong> {conflict.employees.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Dates:</strong> {conflict.dates}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Conflicts Detected</h3>
                      <p className="text-gray-600">All leave requests are compatible with coverage requirements.</p>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Leave Details Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leave Details - {selectedDate}</DialogTitle>
            <DialogDescription>
              View and manage leave requests for this date
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDate && (() => {
              const dayLeaves = getLeaveEventsForDate(selectedDate);
              return dayLeaves.length > 0 ? (
                <div className="space-y-3">
                  {dayLeaves.map((leave) => (
                    <div key={leave.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarFallback>{leave.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{leave.employeeName}</span>
                          <Badge
                            className={
                              leave.status === 'Approved' 
                                ? 'bg-green-100 text-green-800'
                                : leave.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {leave.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{leave.department} • {leave.leaveType}</p>
                        <p className="text-sm text-gray-600">
                          {leave.startDate} - {leave.endDate} ({leave.days} days)
                        </p>
                        {leave.reason && (
                          <p className="text-sm text-gray-500 mt-1">{leave.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Leave Requests</h3>
                  <p className="text-gray-600">No employees are on leave on this date.</p>
                </div>
              );
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveCalendar; 
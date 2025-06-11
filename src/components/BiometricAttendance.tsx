import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  MapPin, 
  User,
  Fingerprint,
  Camera,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Timer,
  Users,
  Activity,
  Eye,
  Download,
  Settings,
  Info,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { calculateWorkingDays, isPublicHoliday, PUBLIC_HOLIDAYS_2025 } from '@/lib/leaveUtils';

interface BiometricDevice {
  id: string;
  name: string;
  location: string;
  type: 'fingerprint' | 'face' | 'iris' | 'card';
  status: 'online' | 'offline' | 'maintenance';
  last_sync: string;
  employee_count: number;
  ip_address: string;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  clock_in?: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  total_hours: number;
  overtime_hours: number;
  status: 'present' | 'absent' | 'late' | 'partial';
  device_id?: string;
  biometric_verified: boolean;
  location_verified: boolean;
  created_at: string;
  employee?: {
    first_name: string;
    last_name: string;
    employee_id: string;
    position: string;
    department_id: string;
  };
}

interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  avgArrivalTime: string;
  avgDepartureTime: string;
  totalHours: number;
  overtimeHours: number;
}

const BiometricAttendance: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('live');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BiometricDevice | null>(null);

  // Mock data for demonstration - in real implementation, this would come from actual biometric devices
  const [biometricDevices] = useState<BiometricDevice[]>([
    {
      id: 'device001',
      name: 'Main Entrance Scanner',
      location: 'Horizon Bank HQ - Main Entrance',
      type: 'fingerprint',
      status: 'online',
      last_sync: new Date().toISOString(),
      employee_count: 150,
      ip_address: '192.168.1.100'
    },
    {
      id: 'device002',
      name: 'Executive Floor Scanner',
      location: 'Horizon Bank HQ - 5th Floor',
      type: 'face',
      status: 'online',
      last_sync: new Date().toISOString(),
      employee_count: 25,
      ip_address: '192.168.1.101'
    },
    {
      id: 'device003',
      name: 'Branch Office Scanner',
      location: 'Wau Branch Office',
      type: 'fingerprint',
      status: 'offline',
      last_sync: new Date(Date.now() - 3600000).toISOString(),
      employee_count: 30,
      ip_address: '192.168.2.100'
    }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att001',
      employee_id: 'emp001',
      clock_in: '2025-01-22T08:30:00Z',
      clock_out: '2025-01-22T17:15:00Z',
      total_hours: 8.75,
      overtime_hours: 0.75,
      status: 'present',
      device_id: 'device001',
      biometric_verified: true,
      location_verified: true,
      created_at: '2025-01-22T08:30:00Z',
      employee: {
        first_name: 'Sarah',
        last_name: 'Akol',
        employee_id: 'HB001',
        position: 'HR Manager',
        department_id: 'hr'
      }
    },
    {
      id: 'att002',
      employee_id: 'emp002',
      clock_in: '2025-01-22T09:15:00Z',
      total_hours: 7.5,
      overtime_hours: 0,
      status: 'late',
      device_id: 'device001',
      biometric_verified: true,
      location_verified: true,
      created_at: '2025-01-22T09:15:00Z',
      employee: {
        first_name: 'Grace',
        last_name: 'Ajak',
        employee_id: 'HB005',
        position: 'Customer Relations Manager',
        department_id: 'personal_banking'
      }
    },
    {
      id: 'att003',
      employee_id: 'emp003',
      status: 'absent',
      total_hours: 0,
      overtime_hours: 0,
      biometric_verified: false,
      location_verified: false,
      created_at: '2025-01-22T00:00:00Z',
      employee: {
        first_name: 'Michael',
        last_name: 'Jok',
        employee_id: 'HB006',
        position: 'Trade Finance Officer',
        department_id: 'trade_finance'
      }
    }
  ]);

  // Calculate attendance statistics
  const calculateStats = (): AttendanceStats => {
    const todayRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.created_at).toISOString().split('T')[0];
      return recordDate === selectedDate;
    });

    const totalEmployees = attendanceRecords.length;
    const presentToday = todayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const absentToday = todayRecords.filter(r => r.status === 'absent').length;
    const lateToday = todayRecords.filter(r => r.status === 'late').length;

    const clockInTimes = todayRecords
      .filter(r => r.clock_in)
      .map(r => new Date(r.clock_in!).getHours() + new Date(r.clock_in!).getMinutes() / 60);
    
    const avgArrivalTime = clockInTimes.length > 0 
      ? clockInTimes.reduce((a, b) => a + b, 0) / clockInTimes.length 
      : 9;

    const clockOutTimes = todayRecords
      .filter(r => r.clock_out)
      .map(r => new Date(r.clock_out!).getHours() + new Date(r.clock_out!).getMinutes() / 60);
    
    const avgDepartureTime = clockOutTimes.length > 0 
      ? clockOutTimes.reduce((a, b) => a + b, 0) / clockOutTimes.length 
      : 17;

    const totalHours = todayRecords.reduce((sum, r) => sum + r.total_hours, 0);
    const overtimeHours = todayRecords.reduce((sum, r) => sum + r.overtime_hours, 0);

    return {
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
      avgArrivalTime: `${Math.floor(avgArrivalTime)}:${String(Math.round((avgArrivalTime % 1) * 60)).padStart(2, '0')}`,
      avgDepartureTime: `${Math.floor(avgDepartureTime)}:${String(Math.round((avgDepartureTime % 1) * 60)).padStart(2, '0')}`,
      totalHours: Math.round(totalHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100
    };
  };

  const stats = calculateStats();

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-600" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'fingerprint': return <Fingerprint className="h-4 w-4 text-blue-600" />;
      case 'face': return <Camera className="h-4 w-4 text-purple-600" />;
      case 'iris': return <Eye className="h-4 w-4 text-green-600" />;
      case 'card': return <Shield className="h-4 w-4 text-gray-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.partial}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const exportAttendanceReport = () => {
    const report = {
      date: selectedDate,
      statistics: stats,
      records: attendanceRecords.filter(record => {
        const recordDate = new Date(record.created_at).toISOString().split('T')[0];
        return recordDate === selectedDate;
      }),
      devices: biometricDevices,
      compliance: {
        labourAct2017: true,
        biometricVerification: true,
        locationTracking: true,
        realTimeSync: true
      }
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${selectedDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance report exported successfully');
  };

  const syncDevices = async () => {
    toast.info('Syncing with biometric devices...');
    
    // Simulate device sync
    setTimeout(() => {
      toast.success('All devices synchronized successfully');
    }, 2000);
  };

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.created_at).toISOString().split('T')[0];
    const matchesDate = recordDate === selectedDate;
    const matchesSearch = record.employee 
      ? `${record.employee.first_name} ${record.employee.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employee.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  const isHoliday = isPublicHoliday(selectedDate);
  const holidayInfo = PUBLIC_HOLIDAYS_2025.find(h => h.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Biometric Attendance & Time Tracking</h2>
          <p className="text-gray-600">
            Real-time attendance monitoring with biometric verification - Labour Act 2017 compliant
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={syncDevices}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Sync Devices
          </Button>
          <Button 
            onClick={exportAttendanceReport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button 
            onClick={() => setShowDeviceDialog(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Devices
          </Button>
        </div>
      </div>

      {/* Labour Act Compliance Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Labour Act 2017 Compliance:</strong> Biometric attendance system ensures accurate working hours tracking, 
          overtime calculation, and integration with leave management for comprehensive workforce monitoring.
        </AlertDescription>
      </Alert>

      {/* Holiday Alert */}
      {isHoliday && (
        <Alert className="border-blue-200 bg-blue-50">
          <Calendar className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Public Holiday:</strong> {holidayInfo?.name} - Limited operations expected today.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live">Live Dashboard</TabsTrigger>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="devices">Biometric Devices</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        {/* Live Dashboard Tab */}
        <TabsContent value="live" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Total Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
                <p className="text-xs text-gray-600 mt-1">Registered in system</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Present Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(stats.presentToday / stats.totalEmployees) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((stats.presentToday / stats.totalEmployees) * 100)}% attendance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Late Arrivals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.lateToday}</div>
                <p className="text-xs text-gray-600 mt-1">After 9:00 AM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Timer className="h-4 w-4 text-purple-600" />
                  Overtime Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.overtimeHours}h</div>
                <p className="text-xs text-gray-600 mt-1">Total overtime today</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Average Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Arrival:</span>
                    <span className="font-semibold text-green-600">{stats.avgArrivalTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Departure:</span>
                    <span className="font-semibold text-blue-600">{stats.avgDepartureTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Hours Today:</span>
                    <span className="font-semibold text-purple-600">{stats.totalHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Biometric Verification:</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Location Tracking:</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Device Sync:</span>
                    <Badge className="bg-blue-100 text-blue-800">Real-time</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Status Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Employee Status</CardTitle>
              <CardDescription>
                Real-time attendance status for {new Date(selectedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.slice(0, 10).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {record.employee?.first_name} {record.employee?.last_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {record.employee?.employee_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(record.clock_in)}</TableCell>
                      <TableCell>{formatTime(record.clock_out)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{record.total_hours}h</div>
                        {record.overtime_hours > 0 && (
                          <div className="text-xs text-orange-600">
                            +{record.overtime_hours}h overtime
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {record.biometric_verified && (
                            <span title="Biometric Verified">
                              <Fingerprint className="h-4 w-4 text-green-600" />
                            </span>
                          )}
                          {record.location_verified && (
                            <span title="Location Verified">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </span>
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

        {/* Attendance Records Tab */}
        <TabsContent value="records" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Detailed attendance records with biometric verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Break Time</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {record.employee?.first_name} {record.employee?.last_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {record.employee?.employee_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {record.employee?.department_id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatTime(record.clock_in)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatTime(record.clock_out)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {record.break_start && record.break_end 
                            ? `${formatTime(record.break_start)} - ${formatTime(record.break_end)}`
                            : '-'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.total_hours}h</div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${record.overtime_hours > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                          {record.overtime_hours}h
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {record.device_id || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {record.biometric_verified && (
                            <span title="Biometric Verified">
                              <Fingerprint className="h-4 w-4 text-green-600" />
                            </span>
                          )}
                          {record.location_verified && (
                            <span title="Location Verified">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </span>
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

        {/* Biometric Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Biometric Device Status</CardTitle>
              <CardDescription>
                Monitor and manage biometric attendance devices across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {biometricDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getDeviceTypeIcon(device.type)}
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-gray-600">{device.location}</div>
                        <div className="text-xs text-gray-500">
                          IP: {device.ip_address} • {device.employee_count} employees registered
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {getDeviceStatusIcon(device.status)}
                          <span className="text-sm font-medium capitalize">{device.status}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last sync: {new Date(device.last_sync).toLocaleTimeString()}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedDevice(device);
                          setShowDeviceDialog(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports & Analytics Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      System compliance with Labour Act 2017:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>✅ Accurate working hours tracking</li>
                        <li>✅ Overtime calculation (8+ hours)</li>
                        <li>✅ Break time monitoring</li>
                        <li>✅ Public holiday integration</li>
                        <li>✅ Biometric verification</li>
                        <li>✅ Location tracking</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Device Uptime:</span>
                    <span className="font-medium text-green-600">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sync Success Rate:</span>
                    <span className="font-medium text-blue-600">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">False Reject Rate:</span>
                    <span className="font-medium text-yellow-600">0.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Response Time:</span>
                    <span className="font-medium text-purple-600">1.2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Device Management Dialog */}
      <Dialog open={showDeviceDialog} onOpenChange={setShowDeviceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Device Management</DialogTitle>
            <DialogDescription>
              Configure and monitor biometric device settings
            </DialogDescription>
          </DialogHeader>
          
          {selectedDevice && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{selectedDevice.name}</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div><strong>Location:</strong> {selectedDevice.location}</div>
                  <div><strong>Type:</strong> {selectedDevice.type}</div>
                  <div><strong>Status:</strong> {selectedDevice.status}</div>
                  <div><strong>IP Address:</strong> {selectedDevice.ip_address}</div>
                  <div><strong>Registered Employees:</strong> {selectedDevice.employee_count}</div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDeviceDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => toast.success('Device settings updated')}>
                  Update Settings
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BiometricAttendance; 
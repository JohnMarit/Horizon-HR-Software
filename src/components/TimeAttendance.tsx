import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  MapPin, 
  Calendar,
  BarChart3,
  Play,
  Pause,
  Square,
  Coffee,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Timer
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TimeEntry {
  id: string;
  clock_in: string;
  clock_out?: string;
  break_duration: number;
  overtime_hours: number;
  location_lat?: number;
  location_lng?: number;
  status: 'clocked_in' | 'on_break' | 'clocked_out';
  created_at: string;
}

interface AttendanceStats {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  daysPresent: number;
  daysAbsent: number;
  averageArrival: string;
}

const TimeAttendance: React.FC = () => {
  const { user } = useAuth();
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<AttendanceStats | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access denied:', error);
          toast.warning('Location access denied. Time tracking will continue without location.');
        }
      );
    }
  }, []);

  // Load today's entries and current status
  useEffect(() => {
    if (user) {
      loadTodayEntries();
      loadWeeklyStats();
    }
  }, [user]);

  const loadTodayEntries = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      // @ts-ignore - Table will exist after schema update
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // @ts-ignore - Data structure will match after schema update
      setTodayEntries(data || []);
      
      // Find current active entry (clocked in or on break)
      // @ts-ignore - Properties will exist after schema update
      const activeEntry = data?.find(entry => 
        entry.status === 'clocked_in' || entry.status === 'on_break'
      );
      // @ts-ignore - Data structure will match after schema update
      setCurrentEntry(activeEntry || null);
    } catch (error) {
      console.error('Error loading today entries:', error);
      toast.error('Failed to load attendance data - ensure database schema is applied');
    }
  };

  const loadWeeklyStats = async () => {
    if (!user) return;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    try {
      // @ts-ignore - Table will exist after schema update
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lt('created_at', weekEnd.toISOString());

      if (error) throw error;

      // Calculate stats
      // @ts-ignore - Data structure will match after schema update
      const stats = calculateWeeklyStats(data || []);
      setWeeklyStats(stats);
    } catch (error) {
      console.error('Error loading weekly stats:', error);
      toast.error('Failed to load weekly stats - ensure database schema is applied');
    }
  };

  const calculateWeeklyStats = (entries: TimeEntry[]): AttendanceStats => {
    let totalHours = 0;
    let overtimeHours = 0;
    const workDays = new Set();
    const arrivalTimes: number[] = [];

    entries.forEach(entry => {
      if (entry.clock_in && entry.clock_out) {
        const clockIn = new Date(entry.clock_in);
        const clockOut = new Date(entry.clock_out);
        const hoursWorked = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
        
        totalHours += hoursWorked;
        overtimeHours += entry.overtime_hours;
        
        workDays.add(clockIn.toDateString());
        arrivalTimes.push(clockIn.getHours() + clockIn.getMinutes() / 60);
      }
    });

    const regularHours = totalHours - overtimeHours;
    const averageArrival = arrivalTimes.length > 0 
      ? arrivalTimes.reduce((a, b) => a + b, 0) / arrivalTimes.length
      : 9;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      regularHours: Math.round(regularHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      daysPresent: workDays.size,
      daysAbsent: 5 - workDays.size, // Assuming 5-day work week
      averageArrival: `${Math.floor(averageArrival)}:${String(Math.round((averageArrival % 1) * 60)).padStart(2, '0')}`
    };
  };

  const handleClockIn = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // @ts-ignore - Table will exist after schema update
      const { data, error } = await supabase
        .from('time_entries')
        .insert([
          {
            employee_id: user.id,
            clock_in: new Date().toISOString(),
            status: 'clocked_in',
            location_lat: location?.lat,
            location_lng: location?.lng,
            break_duration: 0,
            overtime_hours: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // @ts-ignore - Data structure will match after schema update
      setCurrentEntry(data);
      await loadTodayEntries();
      toast.success('Clocked in successfully!');
    } catch (error) {
      console.error('Clock in error:', error);
      toast.error('Failed to clock in - ensure database schema is applied');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentEntry || !user) return;

    setIsLoading(true);
    try {
      const clockOutTime = new Date();
      const clockInTime = new Date(currentEntry.clock_in);
      const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      const overtimeHours = Math.max(0, totalHours - 8); // Assuming 8-hour workday

      // @ts-ignore - Table will exist after schema update
      const { error } = await supabase
        .from('time_entries')
        .update({
          clock_out: clockOutTime.toISOString(),
          status: 'clocked_out',
          overtime_hours: overtimeHours
        })
        .eq('id', currentEntry.id);

      if (error) throw error;

      setCurrentEntry(null);
      await loadTodayEntries();
      await loadWeeklyStats();
      toast.success('Clocked out successfully!');
    } catch (error) {
      console.error('Clock out error:', error);
      toast.error('Failed to clock out - ensure database schema is applied');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBreak = async () => {
    if (!currentEntry) return;

    setIsLoading(true);
    try {
      // @ts-ignore - Table will exist after schema update
      const { error } = await supabase
        .from('time_entries')
        .update({ status: 'on_break' })
        .eq('id', currentEntry.id);

      if (error) throw error;

      setBreakStartTime(new Date());
      setCurrentEntry({ ...currentEntry, status: 'on_break' });
      toast.success('Break started');
    } catch (error) {
      console.error('Start break error:', error);
      toast.error('Failed to start break - ensure database schema is applied');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndBreak = async () => {
    if (!currentEntry || !breakStartTime) return;

    setIsLoading(true);
    try {
      const breakDuration = (new Date().getTime() - breakStartTime.getTime()) / (1000 * 60); // in minutes
      
      // @ts-ignore - Table will exist after schema update
      const { error } = await supabase
        .from('time_entries')
        .update({ 
          status: 'clocked_in',
          break_duration: currentEntry.break_duration + breakDuration
        })
        .eq('id', currentEntry.id);

      if (error) throw error;

      setBreakStartTime(null);
      setCurrentEntry({ 
        ...currentEntry, 
        status: 'clocked_in',
        break_duration: currentEntry.break_duration + breakDuration
      });
      toast.success('Break ended');
    } catch (error) {
      console.error('End break error:', error);
      toast.error('Failed to end break - ensure database schema is applied');
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkingTime = () => {
    if (!currentEntry) return '00:00:00';
    
    const clockIn = new Date(currentEntry.clock_in);
    const now = new Date();
    const diffMs = now.getTime() - clockIn.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clocked_in': return 'bg-green-100 text-green-800';
      case 'on_break': return 'bg-yellow-100 text-yellow-800';
      case 'clocked_out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Time & Attendance</h2>
          <p className="text-gray-600">Track your working hours and manage attendance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-gray-900">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <Tabs defaultValue="clock" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clock">Time Clock</TabsTrigger>
          <TabsTrigger value="today">Today's Activity</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Time Clock Tab */}
        <TabsContent value="clock" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Status Card */}
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentEntry ? (
                  <>
                    <div className="text-center space-y-2">
                      <Badge className={getStatusColor(currentEntry.status)}>
                        {currentEntry.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className="text-3xl font-mono font-bold text-green-600">
                        {getWorkingTime()}
                      </div>
                      <p className="text-sm text-gray-600">
                        Clocked in at {new Date(currentEntry.clock_in).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {currentEntry.status === 'clocked_in' && (
                        <>
                          <Button 
                            onClick={handleStartBreak}
                            disabled={isLoading}
                            variant="outline"
                            className="flex-1"
                          >
                            <Coffee className="h-4 w-4 mr-2" />
                            Start Break
                          </Button>
                          <Button 
                            onClick={handleClockOut}
                            disabled={isLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Clock Out
                          </Button>
                        </>
                      )}
                      
                      {currentEntry.status === 'on_break' && (
                        <Button 
                          onClick={handleEndBreak}
                          disabled={isLoading}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          End Break
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-gray-400">Not Clocked In</div>
                    <p className="text-gray-600">Click below to start your workday</p>
                    <Button 
                      onClick={handleClockIn}
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Clock In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {location ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Location verified: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Location not available. Enable location services for accurate tracking.
                    </AlertDescription>
                  </Alert>
                )}

                {weeklyStats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {weeklyStats.totalHours}h
                      </div>
                      <div className="text-sm text-blue-700">This Week</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {weeklyStats.daysPresent}
                      </div>
                      <div className="text-sm text-green-700">Days Present</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Today's Activity Tab */}
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today's Time Entries</CardTitle>
              <CardDescription>
                All clock-in/out activities for {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayEntries.length > 0 ? (
                <div className="space-y-3">
                  {todayEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-medium">
                            Clock In: {new Date(entry.clock_in).toLocaleTimeString()}
                          </div>
                          {entry.clock_out && (
                            <div className="text-sm text-gray-600">
                              Clock Out: {new Date(entry.clock_out).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status.replace('_', ' ')}
                        </Badge>
                        {entry.clock_out && (
                          <div className="text-sm text-gray-600 mt-1">
                            Duration: {Math.round(
                              (new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime()) / (1000 * 60 * 60) * 100
                            ) / 100}h
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No time entries for today
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Summary Tab */}
        <TabsContent value="weekly">
          {weeklyStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats.totalHours}h</div>
                  <Progress value={(weeklyStats.totalHours / 40) * 100} className="mt-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.round((weeklyStats.totalHours / 40) * 100)}% of 40h goal
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Overtime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {weeklyStats.overtimeHours}h
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Extra hours worked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {weeklyStats.daysPresent}/5
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Days present this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg. Arrival</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyStats.averageArrival}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Average check-in time</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Attendance Reports
              </CardTitle>
              <CardDescription>
                Generate detailed reports for your time and attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Monthly Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Overtime Analysis
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Timer className="h-6 w-6 mb-2" />
                  Time Patterns
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeAttendance; 